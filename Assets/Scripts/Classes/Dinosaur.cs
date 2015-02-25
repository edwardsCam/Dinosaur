using System;

public class Dinosaur
{
	protected Attributes.Strength strength;
	protected Attributes.Agility agility;
	protected Attributes.Energy energy;
	protected Attributes.Sensory sensory;
	protected Attributes.Survivability survivability;
	protected Attributes.Reproducibility reproducibility;
	protected Attributes.Intelligence intelligence;

	public Dinosaur ()
	{
		strength = new Attributes.Strength ();
		agility = new Attributes.Agility ();
		energy = new Attributes.Energy ();
		sensory = new Attributes.Sensory ();
		survivability = new Attributes.Survivability ();
		reproducibility = new Attributes.Reproducibility ();
		intelligence = new Attributes.Intelligence ();
	}
	
	#region Point adders
	
	public void AddPointsStrength (float p)
	{
		strength.Add (p);
	}
	
	public void AddPointsAgility (float p)
	{
		agility.Add (p);
	}
	
	public void AddPointsEnergy (float p)
	{
		energy.Add (p);
	}
	
	public void AddPointsSensory (float p)
	{
		sensory.Add (p);
	}
	
	public void AddPointsSurvivability (float p)
	{
		survivability.Add (p);
	}
	
	public void AddPointsReproducibility (float p)
	{
		reproducibility.Add (p);
	}
	
	public void AddPointsIntelligence (float p)
	{
		intelligence.Add (p);
	}
	
	#endregion
	
	#region Getters
	
	#region Strength
	
	public float Max_HP ()
	{
		return strength.MaxHP ();
	}
	
	public float Combat_Strength ()
	{
		return strength.CombatStrength ();
	}
	
	#endregion
	
	#region Agility
	
	public float Movespeed ()
	{
		return agility.Movespeed ();
	}
	
	public float Stamina_Regen ()
	{
		return agility.StaminaRegen ();
	}
	
	#endregion
	
	#region Energy
	
	public float Max_Stamina ()
	{
		return energy.MaxStamina ();
	}
	
	public float Stamina_Expenditure ()
	{
		return energy.StaminaExpenditure ();
	}
	
	#endregion
	
	#region Survivability
	
	public int Respawn_Time ()
	{
		return survivability.RespawnTime ();
	}
	
	public float HP_Regen ()
	{
		return survivability.HP_Regen ();
	}
	
	#endregion
	
	#endregion
	
	#region Setters and Mutators
	
	
	
	#endregion
}


