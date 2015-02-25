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
		//todo
		return 50.0f * points;
	}

	public static float _combat (float points)
	{
		//todo
		return 1.0f * points;
	}

	#endregion

	#region Agility

	public static float _movespeed (float points)
	{
		//todo
		return 1.2f * points + 4.0f;
	}

	public static float _staminaRegen (float points)
	{
		//todo
		return 5.0f * points;
	}

	#endregion

	#region Energy

	public static float _maxStamina (float points)
	{
		//todo
		return 50.0f;
	}

	public static float _staminaExpend (float points)
	{
		//todo
		return 10.0f;
	}

	#endregion
	
	#region Survivability
	
	public static float _hpRegen (float points)
	{
		//todo
		return 1.0f;
	}
	
	public static int _respawnTime (float points)
	{
		//todo
		return 10;
	}
	
	#endregion
}


