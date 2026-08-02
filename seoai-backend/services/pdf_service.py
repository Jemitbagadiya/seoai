from xhtml2pdf import pisa
import json
import os
import asyncio

def _generate_outline_html(outline_list):
    if not outline_list:
        return ""
    html = '<ul style="list-style-type: none; padding-left: 20px;">'
    for item in outline_list:
        level = item.get('level', '')
        html += f'<li style="margin-bottom: 10px;">'
        html += f'<div style="font-weight: bold; font-size: 110%; color: #374151;">{level}: {item.get("text", "")}</div>'
        if 'notes' in item:
            html += f'<div style="font-size: 90%; color: #6b7280; font-style: italic; margin-left: 10px; margin-bottom: 5px;">Notes: {item["notes"]}</div>'
        if 'subheadings' in item and item['subheadings']:
            html += _generate_outline_html(item['subheadings'])
        html += '</li>'
    html += '</ul>'
    return html

def _generate_gaps_html(gaps_list):
    if not gaps_list:
        return "<p>No content gaps identified.</p>"
    html = ''
    for gap in gaps_list:
        html += f"""
        <div style="background-color: #EFF6FF; border-left: 4px solid #3b82f6; padding: 10px 15px; margin-bottom: 15px;">
            <div style="font-weight: bold; color: #1e3a8a; margin-bottom: 5px;">{gap.get('topic', '')}</div>
            <div style="font-size: 95%; color: #374151;">{gap.get('reason', '')}</div>
        </div>
        """
    return html

def _generate_faq_html(faq_list):
    if not faq_list:
        return "<p>No FAQs suggested.</p>"
    html = '<ul style="list-style-type: none; padding: 0;">'
    for faq in faq_list:
        importance = faq.get('importance', 'low').lower()
        color = "#10b981" if importance == 'low' else "#f59e0b" if importance == 'medium' else "#ef4444"
        html += f"""
        <li style="margin-bottom: 12px; padding: 10px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
            <div style="font-weight: bold; color: #111827;">{faq.get('question', '')}</div>
            <div style="font-size: 85%; margin-top: 5px; color: {color}; font-weight: bold;">Importance: {importance.upper()}</div>
        </li>
        """
    html += '</ul>'
    return html

def _generate_competitors_html(comp_list):
    if not comp_list:
        return "<p>No competitor data available.</p>"
    html = '''
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 90%;">
        <thead>
            <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                <th style="padding: 8px; text-align: left;">URL</th>
                <th style="padding: 8px; text-align: center;">Words</th>
                <th style="padding: 8px; text-align: left;">Key Topics</th>
            </tr>
        </thead>
        <tbody>
    '''
    for comp in comp_list:
        url = comp.get('url', '')
        short_url = (url[:50] + '...') if len(url) > 50 else url
        topics = ", ".join(comp.get('key_topics', []))
        html += f"""
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #2563eb;">{short_url}</td>
                <td style="padding: 8px; text-align: center;">{comp.get('word_count', 0)}</td>
                <td style="padding: 8px; color: #4b5563;">{topics}</td>
            </tr>
        """
    html += '</tbody></table>'
    return html

async def generate_report_pdf(report) -> str:
    """
    Converts the stored JSON report into a styled PDF file.
    """
    report_data = json.loads(report.report_data)
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>SEO Brief: {report.keyword}</title>
        <style>
            @page {{
                margin: 2cm;
            }}
            body {{
                font-family: Helvetica, Arial, sans-serif;
                color: #1f2937;
                line-height: 1.5;
                font-size: 14px;
            }}
            h1 {{
                color: #111827;
                border-bottom: 3px solid #3b82f6;
                padding-bottom: 10px;
                margin-bottom: 20px;
                font-size: 24px;
            }}
            h2 {{
                color: #1f2937;
                font-size: 18px;
                margin-top: 30px;
                margin-bottom: 15px;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 5px;
            }}
            .header-stats {{
                background-color: #f3f4f6;
                padding: 15px;
                margin-bottom: 30px;
            }}
            .header-stats p {{
                margin: 5px 0;
            }}
            .section {{
                margin-bottom: 30px;
            }}
        </style>
    </head>
    <body>
        <h1>Content Brief: {report.keyword}</h1>
        
        <div class="header-stats">
            <p><strong>Meta Title:</strong> {report_data.get('meta_title', 'N/A')}</p>
            <p><strong>Meta Description:</strong> {report_data.get('meta_description', 'N/A')}</p>
            <p><strong>Target Word Count:</strong> <span style="color: #059669; font-weight: bold;">{report_data.get('target_word_count', 0)} words</span></p>
        </div>
        
        <div class="section">
            <h2>Content Outline</h2>
            {_generate_outline_html(report_data.get('content_outline', []))}
        </div>
        
        <div class="section">
            <h2>Content Gaps</h2>
            {_generate_gaps_html(report_data.get('content_gaps', []))}
        </div>
        
        <div class="section">
            <h2>FAQ Suggestions</h2>
            {_generate_faq_html(report_data.get('faq_suggestions', []))}
        </div>
        
        <div class="section">
            <h2>Competitor Analysis</h2>
            {_generate_competitors_html(report_data.get('competitor_analysis', []))}
        </div>
        
    </body>
    </html>
    """
    
    os.makedirs("tmp", exist_ok=True)
    file_path = f"tmp/report_{report.id}.pdf"
    
    def create_pdf():
        with open(file_path, "wb") as result_file:
            pisa_status = pisa.CreatePDF(html_content, dest=result_file)
            if pisa_status.err:
                raise Exception("Failed to generate PDF")
        
    await asyncio.to_thread(create_pdf)
    return file_path