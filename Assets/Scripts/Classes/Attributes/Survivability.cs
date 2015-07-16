using System;

namespace Attribute
{
	public class Survivability : Attribute
	{
	
		private Benefit extra_food_benefit;
		private Benefit hp_regen;
		
		public Survivability () : base()
		{
			extra_food_benefit = new Benefit (false);
			hp_regen = new Benefit ();
			GetBenefitsFromPoints ();
		}
		
		#region Attribute methods
		
		public void Add (float p, bool is_intel_bonus)
		{
			base.AddPoints (p, is_intel_bonus);
		}
		
		protected override void GetBenefitsFromPoints ()
		{
			float p = base.Points ();
			hp_regen.SetBase (Calculate._hpRegen (p));
			extra_food_benefit.SetBase (Calculate._extraFoodBenefit (p));
		}
		
		#endregion
		
		#region Getters
		
		public float _HpRegen ()
		{
			return hp_regen.Value ();
		}
		
		public float _ExtraFoodBenefit ()
		{
			return extra_food_benefit.Value ();
		}
		
		#endregion
		
		#region Setters and Mutators
		
		public void AddTo_HPRegen_Base (float b)
		{
			hp_regen.AddTo_Base (b);
		}
		
		public void AddTo_HPRegen_Modifier (float m)
		{
			hp_regen.AddTo_Modifier (m);
		}
		
		public void AddTo_FoodBenefit (float b)
		{
			extra_food_benefit.AddTo_Base (b);
		}
		
		#endregion
	}
}
