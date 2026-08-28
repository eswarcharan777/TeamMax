import ollama
import base64

def vision_agent(state: dict) -> dict:
    image_path = state.get('image_path', '')
    user_query = state.get('input', 'Analyze this image')

    if not image_path:
        return {
            'agent_name': 'vision_agent',
            'output': 'No image provided.',
            'status': 'skipped'
        }

    try:
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
    except Exception as e:
        return {
            'agent_name': 'vision_agent',
            'output': f'Image load failed: {e}',
            'status': 'error'
        }

    # Step 1: Check if image contains industrial equipment
    check_prompt = (
        "Look at this image carefully. "
        "Does this image show any of the following: industrial equipment, machinery, "
        "motors, electric motors, pumps, fans, compressors, electrical panels, "
        "circuit breakers, pipelines, bearings, gears, belts, conveyor systems, "
        "transformers, generators, engines, mechanical components, or any device "
        "used in manufacturing or industrial settings? "
        "Reply with only YES or NO."
    )

    check_response = ollama.chat(
        model='llava',
        messages=[{
            'role': 'user',
            'content': check_prompt,
            'images': [image_data]
        }]
    )

    answer = check_response['message']['content'].strip().upper()

    # If not a machine image, reject immediately
    if answer.startswith("NO") and "YES" not in answer:
        identify_prompt = (
            "What is the main subject or object visible in this image? "
            "Describe it in one short sentence."
        )
        identify_response = ollama.chat(
            model='llava',
            messages=[{
                'role': 'user',
                'content': identify_prompt,
                'images': [image_data]
            }]
        )
        subject = identify_response['message']['content'].strip()

        return {
            'agent_name': 'vision_agent',
            'output': (
                f"ERROR: No industrial equipment detected in the image.\n\n"
                f"Identified content: {subject}\n\n"
                f"Please upload an image of industrial machinery or equipment "
                f"for fault diagnosis. Persons, animals, and non-industrial objects "
                f"cannot be diagnosed."
            ),
            'status': 'rejected'
        }

    # Step 3: Proceed with normal analysis
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
            'images': [image_data]
        }]
    )

    return {
        'agent_name': 'vision_agent',
        'output': response['message']['content'],
        'status': 'success'
    }

if __name__ == '__main__':
    test_state = {
        'input': 'Check for faults',
        'image_path': 'C:\\Users\\ASUS\\TeamMax\\test_machine.png'
    }
    result = vision_agent(test_state)
    print(result['output'])