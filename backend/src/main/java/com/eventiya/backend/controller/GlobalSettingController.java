package com.eventiya.backend.controller;

import com.eventiya.backend.entity.GlobalSetting;
import com.eventiya.backend.service.GlobalSettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
public class GlobalSettingController {

    @Autowired
    private GlobalSettingService settingsService;

    @PutMapping("/commission")
    public ResponseEntity<?> updateCommission(@RequestParam String value) {
        try {
            GlobalSetting updated = settingsService.updateSetting("COMMISSION_RATE", value);
            return ResponseEntity.ok("Commission rate updated to: " + updated.getSettingValue() + "%");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/commission")
    public ResponseEntity<String> getCommission() {
        String rate = settingsService.getSettingValue("COMMISSION_RATE", "10.00");
        return ResponseEntity.ok(rate);
    }
}