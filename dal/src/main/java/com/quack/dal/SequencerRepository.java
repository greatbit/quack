package com.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.quack.beans.Sequencer;

public interface SequencerRepository extends PagingAndSortingRepository<Sequencer, String> {
}
