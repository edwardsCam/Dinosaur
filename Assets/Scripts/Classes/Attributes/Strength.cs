using System;

namespace Attribute
{
	public class Strength : Attribute
	{
		private Benefit maxHP;
		private Benefit combatStrength;
		
		public Strength () : base()
		{
			maxHP = new Benefit ();
			combatStrength = new Benefit ();
			GetBenefitsFromPoints ();
		}
		
		#region Attribute methods
		
		public void Add (float p)
		{
			base.AddPoints (p);
		}
		
		protected override void GetBenefitsFromPoints ()
		{
			float p = base.Points ();
			maxHP.SetBase (Calculate._maxHP (p));
			combatStrength.SetBase (Calculate._combat (p));
		}
		
		#endregion
		
		#region Getters
		
		public float MaxHP ()
		{
			return maxHP.Value ();
		}
		
		public float CombatStrength ()
		{
			return combatStrength.Value ();
		}
		
		#endregion
		
		#region Setters and Mutators
		
		public void AddMaxHPBase (float b)
		{
			maxHP.AddBase (b);
		}
		
		public void AddMaxHPModifier (float m)
		{
			maxHP.AddModifier (m);
		}
		
		public void AddCombatStrengthBase (float b)
		{
			combatStrength.AddBase (b);
		}
		
		public void AddCombatStrengthModifier (float m)
		{
			combatStrength.AddModifier (m);
		}
		
		#endregion
	}
}

