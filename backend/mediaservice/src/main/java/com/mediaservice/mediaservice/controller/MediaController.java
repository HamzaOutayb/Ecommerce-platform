package com.mediaservice.mediaservice.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mediaservice.mediaservice.service.MediaService;

import io.jsonwebtoken.io.IOException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping("/images")
    public ResponseEntity<List<String>> uploadImages(
            @RequestParam("images") List<MultipartFile> images) {

        List<String> imageUrls = mediaService.uploadImages(images);

        return ResponseEntity.ok(imageUrls);
    }
}