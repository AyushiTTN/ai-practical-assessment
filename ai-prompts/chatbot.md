# Chatbot Implementation Prompts

## Prompt 1: Feature Plan

**Prompt:** Plan to add a chatbot feature to help and guide users in the Support Ticket Management app.

**AI Response Summary:** Proposed hybrid rule-based + optional LLM approach, global chat widget, backend proxy, context-aware replies using state machine rules.

**Accepted:** Rule-based v1 with `POST /api/chat`, floating widget, page/ticket context.

**Rejected:** LLM integration and ticket actions via chat for v1.
