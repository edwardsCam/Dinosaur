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
	protected float total_xp;
	protected float relative_xp;
	protected int level;
	protected static int max_level;
	public bool FLAG_movespeed_changed = false;
	public bool FLAG_visibility_changed = false;
	private string myName = "default";

	public Dinosaur ()
	{
		strength = new Attribute.Strength ();
		agility = new Attribute.Agility ();
		energy = new Attribute.Energy ();
		sensory = new Attribute.Sensory ();
		survivability = new Attribute.Survivability ();
		reproducibility = new Attribute.Reproducibility ();
		intelligence = new Attribute.Intelligence ();
	
		current_hp = strength._MaxHP ();
		current_stamina = energy._MaxStamina ();
		
		attack_radius = new Benefit (10); //TODO

		level = 1;
		total_xp = 0;
		relative_xp = 0;
		
		if (XP_levels == null) {
			var doc = XDocument.Load ("resources/xp.xml").Element ("xp");
			max_level = Convert.ToInt16 (doc.Element ("max_level").Value);
			XP_levels = new int[max_level + 2];
			for (int i = 1; i <= max_level; i++) {
				XP_levels [i] = Convert.ToInt16 (doc.Element ("l_" + i).Value);
			}
		}

		isAlive = true;
	}

	#region Attack and Damage actions

	public bool Attack (Dinosaur other)
	{
		bool success = false;
		float expend = 15;
		if (current_stamina >= expend) {
			if (other != null) {
				addXP (1);
				float damage = strength._CombatStrength ();
				other.TakeDamage (damage);
				if (!other.Is_Alive ()) {
					UnityEngine.Debug.Log (this + " \u2620 " + other);
					addXP (30); //TODO
				}
				success = true;
			}
			current_stamina -= expend;
		}
		return success;
	}

	public void TakeDamage (float d)
	{
		addXP (0.5f);
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
			Restore_HP (delta * survivability._HpRegen ());
			Restore_Stamina (delta * energy._StaminaRegen ());
		}
	}

	private void Restore_HP (float hp)
	{
		current_hp = Math.Min (current_hp + hp, strength._MaxHP ());
	}

	private void Restore_Stamina (float stam)
	{
		current_stamina = Math.Min (current_stamina + stam, energy._MaxStamina ());
	}

	#endregion

	#region XP actions

	public void addXP (float xp)
	{
		total_xp += xp;
		if (level < max_level) {
			relative_xp += xp;
			while (total_xp >= XP_levels[level + 1]) {
				LevelUp ();
				if (level == max_level) {
					relative_xp = 0;
					break;
				}
			}
		}
	}

	private void LevelUp ()
	{
		if (level < max_level) {
			int old_goal = XP_levels [level];
			int new_goal = XP_levels [++level];
			relative_xp -= new_goal - old_goal;
		}
		AddPointsTo_Intelligence (1);
	}

	#endregion
	
	#region Point adders

	protected void BuildAttributesFromXML (string name)
	{
		myName = name;
		var doc = XDocument.Load ("resources/attributes.xml").Element ("species").Element (name);

		int str = Convert.ToInt16 (doc.Element ("stren").Value);
		int agi = Convert.ToInt16 (doc.Element ("aglty").Value);
		int ene = Convert.ToInt16 (doc.Element ("enrgy").Value);
		int sen = Convert.ToInt16 (doc.Element ("sense").Value);
		int rep = Convert.ToInt16 (doc.Element ("repro").Value);
		int sur = Convert.ToInt16 (doc.Element ("survi").Value);
		int tel = Convert.ToInt16 (doc.Element ("intel").Value);

		if (str > 1)
			AddPointsTo_Strength (str - 1);
		if (agi > 1)
			AddPointsTo_Agility (agi - 1);
		if (ene > 1)
			AddPointsTo_Energy (ene - 1);
		if (sen > 1)
			AddPointsTo_Sensory (sen - 1);
		if (rep > 1)
			AddPointsTo_Reproducibility (rep - 1);
		if (sur > 1)
			AddPointsTo_Survivability (sur - 1);
		if (tel > 1)
			AddPointsTo_Intelligence (tel - 1);
	}
	
	protected void AddPointsTo_Strength (float p, bool is_intel_bonus = false)
	{
		float oldHP = strength._MaxHP ();
		strength.Add (p, is_intel_bonus);
		current_hp += strength._MaxHP () - oldHP;
	}
	
	protected void AddPointsTo_Agility (float p, bool is_intel_bonus = false)
	{
		agility.Add (p, is_intel_bonus);
		FLAG_movespeed_changed = true;
	}
	
	protected void AddPointsTo_Energy (float p, bool is_intel_bonus = false)
	{
		float oldStam = energy._MaxStamina ();
		energy.Add (p, is_intel_bonus);
		current_stamina += energy._MaxStamina () - oldStam;
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

	public float Current_XP ()
	{
		return relative_xp;
	}

	public float Total_XP ()
	{
		return total_xp;
	}
	
	public int Next_XP_Goal ()
	{
		if (level < max_level)
			return XP_levels [level + 1] - XP_levels [level];
		return 0;
	}

	public float Attack_Radius ()
	{
		return attack_radius.Value ();
	}

	public bool isAtMaxLevel ()
	{
		return level == max_level;
	}

	public bool Is_Alive ()
	{
		return isAlive;
	}

	#endregion
	
	#region Strength
	
	public float _MaxHP ()
	{
		return strength._MaxHP ();
	}
	
	public float _CombatStrength ()
	{
		return strength._CombatStrength ();
	}
	
	#endregion
	
	#region Agility
	
	public float _Movespeed ()
	{
		return agility._Movespeed ();
	}

	public float _AttackSpeed ()
	{
		return agility._AttackSpeed ();
	}
	
	#endregion
	
	#region Energy
	
	public float _MaxStamina ()
	{
		return energy._MaxStamina ();
	}
	
	public float _StaminaRegen ()
	{
		return energy._StaminaRegen ();
	}
	
	#endregion
	
	#region Sensory
	
	public float _MinFieldOfView ()
	{
		return sensory._MinFieldOfView ();
	}
	
	public float _MaxFieldOfView ()
	{
		return sensory._MaxFieldOfView ();
	}
	
	public float _VisibilityDistance ()
	{
		return sensory._VisibilityDistance ();
	}

	public float _DetectRadius ()
	{
		return sensory._DetectRadius ();
	}
	
	#endregion
	
	#region Reproducibility
	
	public int _RespawnTime ()
	{
		return reproducibility._RespawnTime ();
	}
	
	public float _RebirthPenalty ()
	{
		return reproducibility._RebirthPenalty ();
	}
	
	#endregion
	
	#region Survivability
	
	public float _ExtraFoodBenefit ()
	{
		return survivability._ExtraFoodBenefit ();
	}
	
	public float _HpRegen ()
	{
		return survivability._HpRegen ();
	}
	
	#endregion

	public override string ToString ()
	{
		return myName;
	}
	
	#endregion
}


