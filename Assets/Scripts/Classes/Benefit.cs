using System;

class Benefit
{
	private float base_value;
	private float modifier;
	
	#region Constructors

	public Benefit ()
	{
		base_value = 1.0f;
		modifier = 1.0f;
	}

	public Benefit (float b)
	{
		base_value = b;
		modifier = 1.0f;
	}

	public Benefit (float b, float m)
	{
		base_value = b;
		modifier = m;
	}
	
	#endregion
	
	#region Getters

	public float Value ()
	{
		return base_value * modifier;
	}
	
	#endregion

	#region Setters and Mutators
	
	public void SetBase (float b)
	{
		base_value = b;
	}

	public void SetModifier (float m)
	{
		modifier = m;
	}

	public void AddBase (float b)
	{
		base_value += b;
	}

	public void AddModifier (float m)
	{
		modifier += m;
	}
	
	#endregion
}


