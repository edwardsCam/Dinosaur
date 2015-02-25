using System;

public class Dinosaur
{
	protected Attribute.Strength strength;
	protected Attribute.Agility agility;
	protected Attribute.Energy energy;
	protected Attribute.Sensory sensory;
	protected Attribute.Survivability survivability;
	protected Attribute.Reproducibility reproducibility;
	protected Attribute.Intelligence intelligence;
	
	protected float current_hp;
	protected float current_stamina;

	public Dinosaur ()
	{
		strength = new Attribute.Strength ();
		agility = new Attribute.Agility ();
		energy = new Attribute.Energy ();
		sensory = new Attribute.Sensory ();
		survivability = new Attribute.Survivability ();
		reproducibility = new Attribute.Reproducibility ();
		intelligence = new Attribute.Intelligence ();
		
		current_hp = strength.MaxHP ();
		current_stamina = energy.MaxStamina ();
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
	
	public float Current_HP ()
	{
		return current_hp;
	}
	
	public float Current_Stamina ()
	{
		return current_stamina;
	}
	
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


