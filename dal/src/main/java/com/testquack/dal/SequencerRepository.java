package com.testquack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.testquack.beans.Sequencer;

public interface SequencerRepository extends PagingAndSortingRepository<Sequencer, String> {
}
