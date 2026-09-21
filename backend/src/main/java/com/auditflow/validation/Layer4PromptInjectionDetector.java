package com.auditflow.validation;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class Layer4PromptInjectionDetector {

    private static final Pattern[] INJECTION_PATTERNS = new Pattern[]{
        Pattern.compile("(?i)\\bignore\\s+(?:all\\s+)?(?:previous\\s+)?instructions\\b"),
        Pattern.compile("(?i)\\bdeveloper\\s+mode\\b"),
        Pattern.compile("(?i)\\bDAN\\b"),
        Pattern.compile("(?i)\\bsystem\\s+prompt\\b"),
        Pattern.compile("(?i)\\bbypass\\b.*?\\bfilters\\b"),
        Pattern.compile("(?i)\\bdisregard\\s+rules\\b"),
        Pattern.compile("(?i)\\bคุณคือ\\b|(?i)\\bpretend\\s+to\\s+be\\b")
    };

    public List<String> detectInjections(String text) {
        List<String> threats = new ArrayList<>();
        if (text == null || text.isBlank()) return threats;

        for (Pattern p : INJECTION_PATTERNS) {
            if (p.matcher(text).find()) {
                threats.add("PROMPT_INJECTION_PATTERN: " + p.pattern());
            }
        }
        return threats;
    }
}
