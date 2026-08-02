import os
import json
from anthropic import AsyncAnthropic

# Initialize the async client
# It automatically picks up the ANTHROPIC_API_KEY from your .env file
client = AsyncAnthropic()

async def generate_content_brief(keyword: str, scraped_data: list) -> dict:
    """
    Sends the scraped competitor data to Claude API to generate a structured JSON content brief.
    Matches SRS requirements for system prompt and JSON schema validation.
    """
    
    # 1. System Prompt (Exactly as defined in SRS Section 3.3)
    system_prompt = (
        "You are an expert SEO content strategist. You will receive scraped data from the top-ranking "
        "Google pages for a given keyword. Your job is to analyze this data and produce a complete, "
        "data-driven content brief. You must respond ONLY with valid JSON no markdown, no "
        "preamble, no explanation. Follow the exact JSON schema provided."
    )

    # 2. Output Schema (Exactly as defined in SRS Section 3.4)
    # We define it here to pass directly into the user prompt
    json_schema = {
        "meta_title": "string (max 60 characters, SEO-optimized)",
        "meta_description": "string (max 155 characters)",
        "target_word_count": 0, # Expecting a number
        "content_outline": [
            {
                "level": "H1",
                "text": "string",
                "notes": "optional guidance for the writer",
                "subheadings": [
                    {
                        "level": "H2",
                        "text": "string",
                        "subheadings": [{"level": "H3", "text": "string"}]
                    }
                ]
            }
        ],
        "content_gaps": [
            {"topic": "string", "reason": "why competitors miss this"}
        ],
        "faq_suggestions": [
            {"question": "string", "importance": "high/medium/low"}
        ],
        "competitor_analysis": [
            {"url": "string", "word_count": 0, "key_topics": ["string"]}
        ]
    }

    # 3. User Prompt Construction (As defined in Section 3.3)
    user_message_content = (
        f"Target Keyword: {keyword}\n\n"
        f"Instructions: Identify common topics across competitors, content gaps, and FAQ opportunities.\n\n"
        f"Exact JSON Output Schema required:\n{json.dumps(json_schema, indent=2)}\n\n"
        f"Scraped Competitor Data:\n{json.dumps(scraped_data, indent=2)}"
    )

    try:
        # 4. Call Claude API
        # Using the specific model version outlined in the Tech Stack (Section 2.1)
        response = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096, # High token limit to handle large content briefs
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message_content}
            ]
        )

        # 5. Parse JSON Response
        # Extract the text from Claude's response message
        raw_response_text = response.content[0].text
        
        # Safety cleanup: Occasionally Claude wraps JSON in markdown blocks despite instructions
        clean_text = raw_response_text.replace("```json", "").replace("```", "").strip()
        
        # Convert the string back into a Python dictionary
        brief_json = json.loads(clean_text)
        return brief_json

    except json.JSONDecodeError as e:
        # Matches SRS Section 6: Claude returns malformed JSON
        raise Exception("AI returned unexpected output. Please try again.") from e
        
    except Exception as e:
        # Matches SRS Section 6: Claude API invalid / service failure
        raise Exception("AI service unavailable. Please check key.") from e