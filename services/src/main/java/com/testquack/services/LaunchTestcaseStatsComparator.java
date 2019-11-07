package com.testquack.services;

import com.testquack.beans.LaunchTestcaseStats;

import java.util.Comparator;

import static com.testquack.beans.LaunchStatus.BROKEN;
import static com.testquack.beans.LaunchStatus.FAILED;

public class LaunchTestcaseStatsComparator implements Comparator<LaunchTestcaseStats> {
    @Override
    public int compare(LaunchTestcaseStats o1, LaunchTestcaseStats o2) {
        int o1Failed = o1.getStatusCounters().get(FAILED) + o1.getStatusCounters().get(BROKEN);
        int o2Failed = o2.getStatusCounters().get(FAILED) + o2.getStatusCounters().get(BROKEN);
        int o1FiledRel = o1.getTotal() == 0 ? 0 : (o1Failed * 100) / o1.getTotal();
        int o2FiledRel = o2.getTotal() == 0 ? 0 : (o2Failed * 100) / o2.getTotal();
        return Integer.compare(o2FiledRel, o1FiledRel);
    }
}
