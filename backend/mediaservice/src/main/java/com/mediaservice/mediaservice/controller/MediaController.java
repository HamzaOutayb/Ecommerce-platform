package com.mediaservice.mediaservice.controller;

import com.mediaservice.mediaservice.service.MediaService;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @DeleteMapping("/images")
    public ResponseEntity<List<String>> deleteImages(
            @RequestParam("images") List<String> images) {

       mediaService.deleteImages(images);
        return ResponseEntity.ok().build();
    }
}