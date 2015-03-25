using System;
using System.Xml.Linq;

public class Dinosaur
{
	protected static int[] XP_levels = null;
	protected bool isAlive;
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
	protected int total_xp;
	protected int relative_xp;
	protected int level;
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
		
		attack_radius = new Benefit (20); //TODO

		level = 1;
		total_xp = 0;
		relative_xp = 0;
		
		if (XP_levels == null) {
			var doc = XDocument.Load ("documentation/xp.xml").Element ("xp");
			int max_level = Convert.ToInt16 (doc.Element ("max_level").Value);
			XP_levels = new int[max_level + 2];
			for (int i = 1; i <= max_level; i++) {
				int v = Convert.ToInt16 (doc.Element ("l_" + i).Value);
				XP_levels [i] = v;
				if (i == max_level) {
					XP_levels [i + 1] = v;
				}
			}
		}

		isAlive = true;
	}

	#region Attack and Damage actions

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
			current_hp = 0;
			Die ();
		}
	}

	protected void Die ()
	{
		//TODO
		isAlive = false;
	}

	#endregion

	#region Healing

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

	#region XP actions

	public void addXP (int xp)
	{
		total_xp += xp;
		relative_xp += xp;
		while (total_xp >= XP_levels[level + 1]) {
			LevelUp ();
		}
	}

	private void LevelUp ()
	{
		level++;
		relative_xp -= (XP_levels [level] - XP_levels [level - 1]);
	}



	#endregion
	
	#region Point adders

	protected void BuildAttributesFromXML (string name)
	{
		var doc = XDocument.Load ("documentation/attributes.xml").Element ("species").Element (name);

		int str = Convert.ToInt16 (doc.Element ("strength").Value) - 1;
		int agi = Convert.ToInt16 (doc.Element ("agility").Value) - 1;
		int ene = Convert.ToInt16 (doc.Element ("energy").Value) - 1;
		int sen = Convert.ToInt16 (doc.Element ("sensory").Value) - 1;
		int rep = Convert.ToInt16 (doc.Element ("reproducibility").Value) - 1;
		int sur = Convert.ToInt16 (doc.Element ("survivability").Value) - 1;
		int tel = Convert.ToInt16 (doc.Element ("intelligence").Value) - 1;

		if (str > 0)
			AddPointsTo_Strength (str);
		if (agi > 0)
			AddPointsTo_Agility (agi);
		if (ene > 0)
			AddPointsTo_Energy (ene);
		if (sen > 0)
			AddPointsTo_Sensory (sen);
		if (rep > 0)
			AddPointsTo_Reproducibility (rep);
		if (sur > 0)
			AddPointsTo_Survivability (sur);
		if (tel > 0)
			AddPointsTo_Intelligence (tel);
	}
	
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

	#region Vitals

	public int Current_Level ()
	{
		return level;
	}
	
	public float Current_HP ()
	{
		return current_hp;
	}
	
	public float Current_Stamina ()
	{
		return current_stamina;
	}

	public int Current_XP ()
	{
		return relative_xp;
	}

	public int Total_XP ()
	{
		return total_xp;
	}
	
	public int Next_XP_Goal ()
	{
		return XP_levels [level + 1] - XP_levels [level];
	}

	public float Attack_Radius ()
	{
		return attack_radius.Value ();
	}

	public bool Is_Alive ()
	{
		return isAlive;
	}

	#endregion
	
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


