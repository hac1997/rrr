package edu.ifsc.reevo.repository;

import edu.ifsc.reevo.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Optional<Organization> findOrganizationByCNPJ(String CNPJ);

    Organization findByEmail(String email);

    List<Organization> findByActiveTrue();

    
}
