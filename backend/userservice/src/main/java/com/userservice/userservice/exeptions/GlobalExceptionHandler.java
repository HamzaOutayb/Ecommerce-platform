package com.userservice.userservice.exeptions;

import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.userservice.userservice.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler{

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> handleNotFound() { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Resource not found", 404)); }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex) { return ResponseEntity.badRequest().body(new ErrorResponse(ex.getMessage(), 400)); }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleUploadTooLarge() { return ResponseEntity.badRequest().body(new ErrorResponse("Uploaded file exceeds the 2 MB limit", 400)); }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(ex.getMessage(), 409));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .findFirst().map(error -> error.getField() + ": " + error.getDefaultMessage())
            .orElse("Invalid request");
        return ResponseEntity.badRequest().body(new ErrorResponse(message, 400));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Invalid email or password", 401));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("Access denied", 403));
    }
}