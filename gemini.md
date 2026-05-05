 {
    2   "input_schema": {
    3     "$schema": "http://json-schema.org/draft-07/schema#",
    4     "type": "object",
    5     "properties": {
    6       "message": {
    7         "type": "string",
    8         "description": "The raw customer message text."
    9       },
   10       "business_context": {
   11         "type": "string",
   12         "description": "Optional background information about the business or customer relationship."
   13       },
   14       "language": {
   15         "type": "string",
   16         "description": "Optional ISO language code (e.g., 'en', 'pt', 'es')."
   17       }
   18     },
   19     "required": [
   20       "message"
   21     ],
   22     "additionalProperties": false
   23   },
   24   "output_schema": {
   25     "$schema": "http://json-schema.org/draft-07/schema#",
   26     "type": "object",
   27     "properties": {
   28       "category": {
   29         "type": "string",
   30         "enum": [
   31           "refund",
   32           "delay",
   33           "rude_behavior",
   34           "product_issue",
   35           "other"
   36         ]
   37       },
   38       "urgency_score": {
   39         "type": "integer",
   40         "minimum": 0,
   41         "maximum": 100
   42       },
   43       "reply_tone": {
   44         "type": "string",
   45         "enum": [
   46           "calm",
   47           "apologetic",
   48           "urgent",
   49           "neutral",
   50           "firm"
   51         ]
   52       },
   53       "summary": {
   54         "type": "string",
   55         "description": "Short, normalized version of the complaint."
   56       },
   57       "confidence": {
   58         "type": "number",
   59         "minimum": 0,
   60         "maximum": 1
   61       }
   62     },
   63     "required": [
   64       "category",
   65       "urgency_score",
   66       "reply_tone",
   67       "summary",
   68       "confidence"
   69     ],
   70     "additionalProperties": false
   71   }
   72 }