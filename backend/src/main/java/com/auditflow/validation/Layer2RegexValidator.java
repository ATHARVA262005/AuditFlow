package com.auditflow.validation;

import org.springframework.stereotype.Component;

import java.util.concurrent.*;
import java.util.regex.Pattern;

@Component
public class Layer2RegexValidator {

    private final ExecutorService executor = Executors.newCachedThreadPool();

    public boolean validatePattern(String text, String regexPattern, long timeoutMs) {
        if (regexPattern == null || regexPattern.isBlank()) return true;
        if (text == null) return false;
        if (regexPattern.length() > 1000) {
            throw new IllegalArgumentException("Regex pattern exceeds 1000 character safety limit");
        }

        Future<Boolean> future = executor.submit(() -> {
            Pattern pattern = Pattern.compile(regexPattern);
            return pattern.matcher(text).find();
        });

        try {
            return future.get(timeoutMs, TimeUnit.MILLISECONDS);
        } catch (TimeoutException e) {
            future.cancel(true);
            throw new RuntimeException("Regex execution timed out (potential catastrophic backtracking ReDoS detected)");
        } catch (Exception e) {
            return false;
        }
    }
}
