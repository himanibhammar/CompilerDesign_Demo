export const compileCode = async (code: string) => {
  try {
    const response = await fetch('http://localhost:8000/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Compilation error:", error);
    throw error;
  }
};
