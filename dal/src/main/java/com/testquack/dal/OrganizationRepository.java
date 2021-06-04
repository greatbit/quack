package com.testquack.dal;

import com.testquack.beans.Organization;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface OrganizationRepository extends OrganizationRepositoryCustom,
        PagingAndSortingRepository<Organization, String>, CommonRepository<Organization> {
}
