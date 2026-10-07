package com.example.productservice.service;

import com.example.productservice.dto.ProductRequest;
import com.example.productservice.dto.ProductResponse;
import com.example.productservice.exception.ForbiddenException;
import com.example.productservice.exception.ProductNotFoundException;
import com.example.productservice.mapper.ProductMapper;
import com.example.productservice.model.Product;
import com.example.productservice.repository.ProductRepository;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final KafkaTemplate<String, ProductDeletedEvent> kafkaTemplate;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper,
            KafkaTemplate<String, ProductDeletedEvent> kafkaTemplate) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.kafkaTemplate = kafkaTemplate;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        return productMapper.toResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request, String sellerId) {
        Product product = productMapper.toEntity(request);
        product.setSellerId(sellerId);
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }

    public ProductResponse updateProduct(String id, ProductRequest request, String sellerId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        if (!product.getSellerId().equals(sellerId)) {
            throw new ForbiddenException("You are not the owner of this product");
        }

        productMapper.updateEntityFromRequest(product, request);
        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponse(updatedProduct);
    }

    public void deleteProduct(String id, String sellerId) {

        System.out.println("1 - ID: " + id);
        System.out.println("2 - Seller ID: " + sellerId);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product not found with id: " + id));

        System.out.println("3 - Product found: " + product.getId());
        System.out.println("4 - Product seller: " + product.getSellerId());

        if (!product.getSellerId().equals(sellerId)) {
            System.out.println("5 - NOT OWNER");
            throw new ForbiddenException(
                    "You are not the owner of this product");
        }

        System.out.println("6 - Owner verified");

        ProductDeletedEvent event = new ProductDeletedEvent(product.getImageUrls());

        System.out.println("7 - Event created");

        kafkaTemplate.send(
                "images-deleted",
                product.getId(),
                event);

        System.out.println("8 - Kafka send called");

        productRepository.deleteById(id);

        System.out.println("9 - Product deleted");
    }

    public record ProductDeletedEvent(
            List<String> imagePaths) {
    }
}
