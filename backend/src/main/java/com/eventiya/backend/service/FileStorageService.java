package com.eventiya.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path root = Paths.get("uploads");

    public String saveImage(MultipartFile file) throws IOException {

        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new RuntimeException("Invalid file type. Only JPG and PNG are allowed.");
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        Files.copy(file.getInputStream(), this.root.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}