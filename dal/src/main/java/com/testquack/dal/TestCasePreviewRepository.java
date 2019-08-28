package com.testquack.dal;

import com.testquack.beans.TestCase;
import com.testquack.beans.TestCasePreview;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface TestCasePreviewRepository extends TestCaseRepositoryCustom,
        PagingAndSortingRepository<TestCase, String>, CommonRepository<TestCasePreview> {
}
