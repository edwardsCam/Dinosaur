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

	protected Benefit hit_radius;
	protected Benefit attack_radius;

	protected bool isDead = false;

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

		hit_radius = new Benefit ();
		attack_radius = new Benefit ();

		hit_radius.SetBase (5);
		attack_radius.SetBase (5);
	}

	#region Actions

	public void Attack (Dinosaur other)
	{
		float expend = energy.StaminaExpenditure ();
		if (current_stamina >= expend) {
			float damage = strength.CombatStrength ();
			other.TakeDamage (damage);
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
		isDead = true;
	}

	public void Heal (float delta)
	{
		if (!isDead) {
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
	
	public void AddPointsTo_Strength (float p)
	{
		strength.Add (p);
	}
	
	public void AddPointsTo_Agility (float p)
	{
		agility.Add (p);
	}
	
	public void AddPointsTo_Energy (float p)
	{
		energy.Add (p);
	}
	
	public void AddPointsTo_Sensory (float p)
	{
		sensory.Add (p);
	}
	
	public void AddPointsTo_Survivability (float p)
	{
		survivability.Add (p);
	}
	
	public void AddPointsTo_Reproducibility (float p)
	{
		reproducibility.Add (p);
	}
	
	public void AddPointsTo_Intelligence (float p)
	{
		intelligence.Add (p);

		//blanket improvement over all attributes
		float p_frac = p / 6f;
		strength.Add (p_frac, true);
		agility.Add (p_frac, true);
		energy.Add (p_frac, true);
		sensory.Add (p_frac, true);
		survivability.Add (p_frac, true);
		reproducibility.Add (p_frac, true);
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

	public float Hit_Radius ()
	{
		return hit_radius.Value ();
	}

	public float Attack_Radius ()
	{
		return attack_radius.Value ();
	}

	public bool Is_Dead ()
	{
		return isDead;
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


