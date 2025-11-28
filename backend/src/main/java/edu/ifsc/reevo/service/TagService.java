package edu.ifsc.reevo.service;

import edu.ifsc.reevo.dto.DtoRequest;
import edu.ifsc.reevo.model.helper.Tag;
import edu.ifsc.reevo.repository.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public Tag addTag(DtoRequest.TagRequestDTO requestDTO) {
        log.info("ADDING TAG WITH REQUEST :: {}",requestDTO);
        return tagRepository.save(
                Tag.builder()
                        .code(requestDTO.code())
                        .label(requestDTO.label())
                        .build()
        );
    }

    public Tag updateTagById(Long tagId, DtoRequest.TagRequestDTO requestDTO) {
        log.info("UPDATING TAG WITH ID :: {} :: AND REQUEST :: {}",tagId, requestDTO);
        var tag = this.findByTagId(tagId);
        tag.setCode(requestDTO.code());
        tag.setLabel(requestDTO.label());

        return tagRepository.save(tag);
    }

    public List<Tag> getAllTags() {
        log.info("GETTING ALL TAGS");
        return tagRepository.findAll();
    }

    public Tag getTagById(Long tagId) {
        log.info("GETTING TAG BY ID :: {}",tagId);
        return this.findByTagId(tagId);
    }

    public List<Tag> getTagsByCode(String code) {
        log.info("GETTING TAGS BY CODE :: {}",code);
        return tagRepository.findByCode(code);
    }

    protected Tag findByTagId(Long tagId) {
        log.info("FINDING TAG WITH ID :: {}",tagId);
        return tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("TAG NOT FOUND WITH ID :: "+tagId));
    }

    public void deleteTag(Long tagId) {
        log.info("REMOVING TAG WITH ID :: {}",tagId);
        tagRepository.deleteById(tagId);
    }
}