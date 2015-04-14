using System;

public class Benefit
{
	private float base_value;
	private float extra;
	private float modifier;
	private bool can_multiply;
	
	#region Constructors

	public Benefit (bool _can_multiply = true)
	{
		base_value = 1.0f;
		modifier = 1.0f;
		extra = 0f;
		can_multiply = _can_multiply;
	}

	public Benefit (float b, bool _can_multiply = true)
	{
		base_value = b;
		modifier = 1.0f;
		extra = 0f;
		can_multiply = _can_multiply;
	}
	
	#endregion
	
	#region Getters

	public float Value ()
	{
		return (base_value + extra) * modifier;
	}
	
	#endregion

	#region Setters and Mutators
	
	public void SetBase (float b)
	{
		base_value = b;
	}

	public void SetModifier (float m)
	{
		if (can_multiply)
			modifier = m;
	}

	public void AddTo_Base (float b)
	{
		extra += b;
	}

	public void AddTo_Modifier (float m)
	{
		if (can_multiply)
			modifier += m;
	}
	
	public void Reset_Extra ()
	{
		extra = 0f;
	}
	
	#endregion
}


