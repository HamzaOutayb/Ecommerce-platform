package com.example.productservice.service;

import com.example.productservice.dto.ProductRequest;
import com.example.productservice.dto.ProductResponse;
import com.example.productservice.exception.ForbiddenException;
import com.example.productservice.mapper.ProductMapper;
import com.example.productservice.model.Product;
import com.example.productservice.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    private ProductRepository productRepository;
    private ProductMapper productMapper;
    private ProductService productService;

    @BeforeEach
    void setUp() {
        productRepository = mock(ProductRepository.class);
        productMapper = new ProductMapper(); // Real mapper to test behavior
        productService = new ProductService(productRepository, productMapper);
    }

    @Test
    void createProduct_SetsSellerId() {
        ProductRequest request = new ProductRequest();
        request.setName("Test");
        request.setPrice(BigDecimal.TEN);
        request.setQuantity(5);
        
        when(productRepository.save(any(Product.class))).thenAnswer(i -> {
            Product p = i.getArgument(0);
            p.setId("1");
            return p;
        });

        ProductResponse response = productService.createProduct(request, "seller123");
        
        assertNotNull(response);
        assertEquals("seller123", response.getSellerId());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void updateProduct_RejectsNonOwner() {
        Product product = new Product();
        product.setId("1");
        product.setSellerId("ownerId");
        when(productRepository.findById("1")).thenReturn(Optional.of(product));

        ProductRequest request = new ProductRequest();
        
        assertThrows(ForbiddenException.class, () -> {
            productService.updateProduct("1", request, "differentId");
        });
        verify(productRepository, never()).save(any());
    }

    @Test
    void deleteProduct_RejectsNonOwner() {
        Product product = new Product();
        product.setId("1");
        product.setSellerId("ownerId");
        when(productRepository.findById("1")).thenReturn(Optional.of(product));

        assertThrows(ForbiddenException.class, () -> {
            productService.deleteProduct("1", "differentId");
        });
        verify(productRepository, never()).delete(any());
    }
}
