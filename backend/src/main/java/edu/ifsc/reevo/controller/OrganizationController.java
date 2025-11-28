package edu.ifsc.reevo.controller;

import edu.ifsc.reevo.dto.DtoRequest.OrganizationRequestDTO;
import edu.ifsc.reevo.dto.OrganizationResponseDTO;
import edu.ifsc.reevo.model.Organization;
import edu.ifsc.reevo.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<Organization> addOrganization(@Valid @RequestBody OrganizationRequestDTO requestDTO) {
        return ResponseEntity.ok(organizationService.addOrganization(requestDTO));
    }

    @PutMapping
    public ResponseEntity<Organization> updateOrganization(@Valid @RequestBody OrganizationRequestDTO requestDTO) {
        return ResponseEntity.ok(organizationService.updateOrganization(requestDTO));
    }

    @PatchMapping("/{cnpj}/members/{memberId}")
    public ResponseEntity<Organization> toggleOrganizationMember(
            @PathVariable String cnpj,
            @PathVariable Long memberId) {
        return ResponseEntity.ok(organizationService.addOrRemoveMemberToOrganization(memberId, cnpj));
    }

    @PatchMapping("/{orgId}/deactivate")
    public ResponseEntity<Void> deactivateOrganization(@PathVariable Long orgId) {
        organizationService.deactivatingOrganization(orgId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{orgId}")
    public ResponseEntity<OrganizationResponseDTO> getOrganizationById(@PathVariable Long orgId) {
        return ResponseEntity.ok(organizationService.getOrganizationResponseById(orgId));
    }

}
