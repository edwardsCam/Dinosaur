using System;

namespace Attributes
{
	public class Energy : Attribute
	{
		private Benefit max_stamina;
		private Benefit stamina_expend;
		
		public Energy () : base()
		{
			max_stamina = new Benefit ();
			stamina_expend = new Benefit ();
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
			max_stamina.SetBase (Calculate._maxStamina (p));
			stamina_expend.SetBase (Calculate._staminaExpend (p));
		}
		
		#endregion
		
		#region Getters
		
		public float MaxStamina ()
		{
			return max_stamina.Value ();
		}
		
		public float StaminaExpenditure ()
		{
			return stamina_expend.Value ();
		}
		
		#endregion
		
		#region Setters and Mutators
		
		public void AddMaxStaminaBase (float b)
		{
			max_stamina.AddBase (b);
		}
		
		public void AddMaxStaminaModifier (float m)
		{
			max_stamina.AddModifier (m);
		}
		
		public void AddStaminaExpendBase (float b)
		{
			stamina_expend.AddBase (b);
		}
		
		public void AddStaminaExpendModifier (float m)
		{
			stamina_expend.AddModifier (m);
		}
		
		#endregion
	}
}

