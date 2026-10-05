package com.mediaservice.mediaservice.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mediaservice.mediaservice.exception.MediaUploadException;
import com.mediaservice.mediaservice.models.Media;
import com.mediaservice.mediaservice.repository.MediaRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MediaService {

    private final Cloudinary cloudinary;
    private final MediaRepository mediaRepository;

    public MediaService(
            Cloudinary cloudinary,
            MediaRepository mediaRepository) {
        this.cloudinary = cloudinary;
        this.mediaRepository = mediaRepository;
    }

    public List<String> uploadImages(List<MultipartFile> files) {

        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                Map<?, ?> result = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "resource_type", "image"));

                String imagePath = result.get("secure_url").toString();

                Media media = new Media();
                media.setImagePath(imagePath);
                mediaRepository.save(media);

                imagePaths.add(imagePath);

            } catch (IOException e) {
                throw new MediaUploadException(
                        "Failed to upload image",
                        e);
            }
        }

        return imagePaths;
    }
}