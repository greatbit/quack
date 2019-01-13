package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.Sequencer;

public interface SequencerRepository extends PagingAndSortingRepository<Sequencer, String> {
}
