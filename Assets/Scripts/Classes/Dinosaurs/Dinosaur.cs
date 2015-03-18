using System;

public class Dinosaur
{
	protected bool isAlive = true;

	protected Attribute.Strength strength;
	protected Attribute.Agility agility;
	protected Attribute.Energy energy;
	protected Attribute.Sensory sensory;
	protected Attribute.Survivability survivability;
	protected Attribute.Reproducibility reproducibility;
	protected Attribute.Intelligence intelligence;

	protected float current_hp;
	protected float current_stamina;
	protected Benefit attack_radius;

	public bool FLAG_movespeed_changed = false;
	public bool FLAG_visibility_changed = false;

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
		
		attack_radius = new Benefit ();
		attack_radius.SetBase (5); //TODO
	}

	#region Actions

	public void Attack (Dinosaur other)
	{
		float expend = energy.StaminaExpenditure ();
		if (current_stamina >= expend) {
			if (other != null) {
				float damage = strength.CombatStrength ();
				other.TakeDamage (damage);
			}
			current_stamina -= expend;
		}
	}

	public void TakeDamage (float d)
	{
		current_hp -= d;
		if (current_hp <= 0) {
			Die ();
		}
	}

	protected void Die ()
	{
		//TODO
		isAlive = false;
	}

	public void Heal (float delta)
	{
		if (isAlive) {
			Restore_HP (delta * survivability.HP_Regen ());
			Restore_Stamina (delta * agility.StaminaRegen ());
		}
	}

	private void Restore_HP (float hp)
	{
		current_hp = Math.Min (current_hp + hp, strength.MaxHP ());
	}

	private void Restore_Stamina (float stam)
	{
		current_stamina = Math.Min (current_stamina + stam, energy.MaxStamina ());
	}

	#endregion
	
	#region Point adders
	
	protected void AddPointsTo_Strength (float p, bool is_intel_bonus = false)
	{
		float oldHP = strength.MaxHP ();
		strength.Add (p, is_intel_bonus);
		current_hp += strength.MaxHP () - oldHP;
	}
	
	protected void AddPointsTo_Agility (float p, bool is_intel_bonus = false)
	{
		agility.Add (p, is_intel_bonus);
		FLAG_movespeed_changed = true;
	}
	
	protected void AddPointsTo_Energy (float p, bool is_intel_bonus = false)
	{
		float oldStam = energy.MaxStamina ();
		energy.Add (p, is_intel_bonus);
		current_stamina += energy.MaxStamina () - oldStam;
	}
	
	protected void AddPointsTo_Sensory (float p, bool is_intel_bonus = false)
	{
		sensory.Add (p, is_intel_bonus);
		FLAG_visibility_changed = true;
	}
	
	protected void AddPointsTo_Survivability (float p, bool is_intel_bonus = false)
	{
		survivability.Add (p, is_intel_bonus);
	}
	
	protected void AddPointsTo_Reproducibility (float p, bool is_intel_bonus = false)
	{
		reproducibility.Add (p, is_intel_bonus);
	}
	
	protected void AddPointsTo_Intelligence (float p)
	{
		intelligence.Add (p);

		//blanket improvement over all attributes
		float p_frac = p / 6f;
		AddPointsTo_Strength (p_frac, true);
		AddPointsTo_Agility (p_frac, true);
		AddPointsTo_Energy (p_frac, true);
		AddPointsTo_Sensory (p_frac, true);
		AddPointsTo_Survivability (p_frac, true);
		AddPointsTo_Reproducibility (p_frac, true);
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

	public float Attack_Radius ()
	{
		return attack_radius.Value ();
	}

	public bool Is_Alive ()
	{
		return isAlive;
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
	
	#region Sensory
	
	public float MinFieldOfView ()
	{
		return sensory.MinFieldOfView ();
	}
	
	public float MaxFieldOfView ()
	{
		return sensory.MaxFieldOfView ();
	}
	
	public float VisibilityDistance ()
	{
		return sensory.VisibilityDistance ();
	}
	
	#endregion
	
	#region Reproducibility
	
	public int Respawn_Time ()
	{
		return reproducibility.RespawnTime ();
	}
	
	public float Rebirth_Penalty ()
	{
		return reproducibility.RebirthPenalty ();
	}
	
	#endregion
	
	#region Survivability
	
	public float Extra_Food_Benefit ()
	{
		return survivability.Extra_Food_Benefit ();
	}
	
	public float HP_Regen ()
	{
		return survivability.HP_Regen ();
	}
	
	#endregion
	
	#endregion
}


