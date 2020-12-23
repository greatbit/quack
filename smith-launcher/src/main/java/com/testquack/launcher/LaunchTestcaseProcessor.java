package com.testquack.launcher;

import com.testquack.beans.FailureDetails;
import com.testquack.beans.LaunchStatus;
import com.testquack.services.LaunchService;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.utils.serialize.JsonSerializer;
import ru.greatbit.whoru.auth.Person;
import ru.greatbit.whoru.auth.Session;

import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service("launchTestcaseProcessor")
public class LaunchTestcaseProcessor implements Processor {

    protected final Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    LaunchService launchService = new LaunchService();

    @Override
    public void process(Exchange exchange) throws Exception {
        String message = (String) JsonSerializer.unmarshal(exchange.getIn().getBody(String.class), Map.class).get("Message");
        if (message != null){
            TestCaseResult testCaseResult = JsonSerializer.unmarshal(message, TestCaseResult.class);
            Session adminSession = (Session) new Session().withId(UUID.randomUUID().toString()).
                    withIsAdmin(true).withPerson(new Person().withId("aws-smith").withLogin("aws-smith"));
            launchService.updateLaunchTestCaseStatus(null, adminSession, testCaseResult.getProjectId(),
                    testCaseResult.getLaunchId(), testCaseResult.getTestcaseUuid(),
                    testCaseResult.isPassed() ? LaunchStatus.PASSED : LaunchStatus.FAILED,
                    testCaseResult.isPassed() ? null : new FailureDetails().withText(getMessageLog(testCaseResult)));
        }
    }

    private String getMessageLog(TestCaseResult testCaseResult) {
        StringBuilder messageBuilder = new StringBuilder();
        if (!isEmpty(testCaseResult.getMessage())){
            messageBuilder.append(testCaseResult.getMessage());
        }
        return messageBuilder.toString();
    }
}
