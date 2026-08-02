import os
import json
import google.generativeai as genai

# Configure the SDK with the key from your .env file
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def generate_content_brief(keyword: str, scraped_data: list) -> dict:
    """
    Sends scraped data to Gemini API to generate a structured JSON content brief.
    Matches SRS requirements for system prompt and JSON schema validation.
    """
    # Define the required output structure (from SRS Section 3.4)
    json_schema = {
        "meta_title": "string (max 60 characters, SEO-optimized)",
        "meta_description": "string (max 155 characters)",
        "target_word_count": "number (recommended article length based on competitor analysis)",
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

    # Construct the strict instructional prompt
    prompt = (
        "You are an expert SEO content strategist. You will receive scraped data from the top-ranking "
        "Google pages for a given keyword. Your job is to analyze this data and produce a complete, "
        "data-driven content brief. You must respond ONLY with valid JSON no markdown, no "
        "preamble, no explanation. Follow the exact JSON schema provided.\n\n"
        f"Target Keyword: {keyword}\n\n"
        f"""Instructions:
            - Analyze all competitor pages.
            - Generate an SEO-optimized Meta Title (maximum 60 characters).
            - Generate an SEO-optimized Meta Description (maximum 155 characters).
            - Calculate a recommended target_word_count using competitor word counts.
            - Never return target_word_count as 0.
            - target_word_count must always be an integer.
            - Generate a complete H1 → H2 → H3 content outline.
            - Add helpful writer notes.
            - Identify important content gaps.
            - Generate FAQ suggestions with High / Medium / Low importance.
            - Populate competitor_analysis using the competitor URLs and word counts.
            - Return ONLY valid JSON.
            """
        f"Exact JSON Output Schema required:\n{json.dumps(json_schema, indent=2)}\n\n"
        f"Scraped Competitor Data:\n{json.dumps(scraped_data, indent=2)}"
    )

    try:
        # Initialize the Flash model and force JSON output formatting
        model = genai.GenerativeModel(
            model_name="gemini-3.1-flash-lite",
            generation_config={"response_mime_type": "application/json"}
        )
        
        # Call Gemini API asynchronously
        response = await model.generate_content_async(prompt)
        
        # Clean and parse the response
        raw_response_text = response.text
        clean_text = raw_response_text.replace("```json", "").replace("```", "").strip()
        brief_json = json.loads(clean_text)

        # Fallback if Gemini returns 0 or doesn't return target_word_count
        counts = [
            item.get("word_count", 0)
            for item in scraped_data
            if item.get("word_count", 0) > 0
        ]

        if counts:
            average = int(sum(counts) / len(counts))

            if (
                "target_word_count" not in brief_json
                or not isinstance(brief_json["target_word_count"], int)
                or brief_json["target_word_count"] <= 0
            ):
                brief_json["target_word_count"] = average

        return brief_json

    except json.JSONDecodeError as e:
        raise Exception("AI returned unexpected output. Please try again.") from e
    except Exception as e:
        print(f"Gemini API Error details: {str(e)}")
        raise Exception(f"AI service unavailable. Details: {str(e)}") from e