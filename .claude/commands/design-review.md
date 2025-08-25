---
name: design-review
description: Conduct a comprehensive design review of UI changes using the design-review agent
---

You need to invoke the design-review agent to conduct a comprehensive design review of the current UI changes.

First, start the development server if it's not already running, then use the design-review agent to systematically review all UI changes following the phases outlined in /.claude/agents/design-review-agent.md.

The agent will:
1. Prepare by analyzing changes and setting up Playwright
2. Test interaction and user flows
3. Verify responsiveness across viewports
4. Assess visual polish and consistency
5. Check accessibility compliance (WCAG 2.1 AA)
6. Test robustness and edge cases
7. Review code health
8. Check content and console for issues

Use the Task tool to invoke the design-review agent with the following prompt:

"Review the UI changes in this project. The development server should be running on http://localhost:3000. Conduct a comprehensive design review following all phases in your methodology. Provide a structured report with findings categorized as Blockers, High-Priority, Medium-Priority, and Nitpicks."

The final output should be a markdown report following the structure defined in the agent configuration.