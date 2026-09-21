package com.auditflow.validation;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class Layer3PiiDetector {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\b\\+?[0-9]{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}\\b");
    private static final Pattern CREDIT_CARD_PATTERN = Pattern.compile("\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\\b");
    private static final Pattern SSN_PATTERN = Pattern.compile("\\b\\d{3}-\\d{2}-\\d{4}\\b");
    private static final Pattern API_KEY_PATTERN = Pattern.compile("(?:sk-[a-zA-Z0-9]{32,}|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36})");

    public List<String> detectPii(String text) {
        List<String> found = new ArrayList<>();
        if (text == null || text.isBlank()) return found;

        if (EMAIL_PATTERN.matcher(text).find()) found.add("EMAIL_ADDRESS");
        if (PHONE_PATTERN.matcher(text).find()) found.add("PHONE_NUMBER");
        if (CREDIT_CARD_PATTERN.matcher(text).find()) found.add("CREDIT_CARD");
        if (SSN_PATTERN.matcher(text).find()) found.add("US_SSN");
        if (API_KEY_PATTERN.matcher(text).find()) found.add("SECRET_API_KEY");

        return found;
    }
}
