using System;

/*

Calculate.cs

...Static class containing methods that convert points (from an attribute) into actual values.

*/

static class Calculate
{
	#region Strength
	
	public static float _maxHP (float points)
	{
		//1  point  -> 50
		//10 points -> 400
		return 11.111f + 38.889f * points;
	}
	
	public static float _combatStrength (float points)
	{
		//TODO
		return 1.0f * points;
	}
	
	#endregion
	
	#region Agility
	
	public static float _movespeed (float points)
	{
		//1  point  -> 7
		//10 points -> 30
		return 4.444f + 2.556f * points;
	}
	
	public static float _staminaRegen (float points)
	{
		//TODO
		return 5.0f * points;
	}
	
	#endregion
	
	#region Energy
	
	public static float _maxStamina (float points)
	{
		//TODO
		return 50.0f;
	}
	
	public static float _staminaExpend (float points)
	{
		//TODO
		return 10.0f;
	}
	
	#endregion
	
	#region Sensory
	
	public static float _minFieldOfView (float points)
	{
		//1  point  -> 50
		//10 points -> 5
		float ret = 55f - 5f * points;
		return Math.Max (5f, ret);
	}
	
	public static float _maxFieldOfView (float points)
	{
		//1  point  -> 80
		//10 points -> 150
		float ret = 72.222f + 7.778f * points;
		return Math.Min (160f, ret);
	}
	
	public static float _distance (float points)
	{
		//1  point  -> 100
		//10 points -> 800
		return 22.222f + 77.778f * points;
	}
	
	#endregion
	
	#region Reproducibility
	
	public static int _respawnTime (float points)
	{
		//TODO
		return 10;
	}
	
	public static float _rebirthPenalty (float points)
	{
		//TODO
		return 1.0f;
	}
	
	#endregion
	
	#region Survivability
	
	public static float _hpRegen (float points)
	{
		//TODO
		return 1.0f;
	}
	
	public static float _extraFoodBenefit (float points)
	{
		//TODO
		return 0.15f;
	}
	
	#endregion
}


