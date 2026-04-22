package com.eventiya.backend.service;

import com.eventiya.backend.entity.GlobalSetting;
import com.eventiya.backend.repository.GlobalSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class GlobalSettingService {

    @Autowired
    private GlobalSettingRepository repository;

    public String getSettingValue(String key, String defaultValue) {
        return repository.findBySettingKey(key)
                .map(GlobalSetting::getSettingValue)
                .orElse(defaultValue);
    }

    public GlobalSetting updateSetting(String key, String value) {
        Optional<GlobalSetting> existingSetting = repository.findBySettingKey(key);

        GlobalSetting setting;
        if (existingSetting.isPresent()) {
            setting = existingSetting.get();
            setting.setSettingValue(value);
        } else {
            setting = new GlobalSetting(key, value);
        }

        return repository.save(setting);
    }
}