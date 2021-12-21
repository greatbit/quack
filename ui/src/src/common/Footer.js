import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <span className="text-muted" className="col-3"><a href="https://greatbit.com.au" target="_blanc">@GreatBit</a></span>
          <span className="text-muted" className="col-3"><a href="https://www.testquack.com" target="_blanc">TestQuAck.com</a></span>
          <span className="text-muted" className="col-3"><a href="https://www.testquack.com/#contacts" target="_blanc">Contact Us</a></span>
          <span className="text-muted" className="col-3"><a href="https://github.com/greatbit/quack/issues/new?assignees=&labels=&template=bug_report.md&title=" target="_blanc">Report a Bug</a></span>
        </div>
      </footer>
    );
  }
}

export default Footer;
