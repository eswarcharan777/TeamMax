import ollama

def vision_agent(state: dict) -> dict:
    image_path = state.get('image_path', '')
    user_query = state.get('input', 'Analyze this image')

    if not image_path:
        return {
            'agent_name': 'vision_agent',
            'output': 'No image provided.',
            'status': 'skipped'
        }

    prompt = (
        "You are an industrial equipment inspector. Analyze this image and describe:\n"
        "1. What equipment is shown\n"
        "2. Any visible damage, cracks, or faults\n"
        "3. Estimated severity of damage\n"
        f"Context: {user_query}"
    )

    response = ollama.chat(
        model='llava',
        messages=[{
            'role': 'user',
            'content': prompt,
            'images': [image_path]
        }]
    )

    return {
        'agent_name': 'vision_agent',
        'output': response['message']['content'],
        'status': 'success'
    }

# This part runs when you test the file directly
if __name__ == '__main__':
    test_state = {
        'input': 'Check for faults',
        'image_path': 'test_machine.jpg'
    }
    result = vision_agent(test_state)
    print(result['output'])