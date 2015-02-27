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
			combatStrength.SetBase (Calculate._combatStrength (p));
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
		
		public void AddTo_MaxHP_Base (float b)
		{
			maxHP.AddTo_Base (b);
		}
		
		public void AddTo_MaxHP_Modifier (float m)
		{
			maxHP.AddTo_Modifier (m);
		}
		
		public void AddTo_CombatStrength_Base (float b)
		{
			combatStrength.AddTo_Base (b);
		}
		
		public void AddTo_CombatStrength_Modifier (float m)
		{
			combatStrength.AddTo_Modifier (m);
		}
		
		#endregion
	}
}

