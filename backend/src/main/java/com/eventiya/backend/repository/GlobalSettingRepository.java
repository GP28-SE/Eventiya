package com.eventiya.backend.repository;

import com.eventiya.backend.entity.GlobalSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GlobalSettingRepository extends JpaRepository<GlobalSetting, Long> {

    Optional<GlobalSetting> findBySettingKey(String key);
}
