using System;

namespace Attribute
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
		
		public void AddTo_MaxStamina_Base (float b)
		{
			max_stamina.AddTo_Base (b);
		}
		
		public void AddTo_MaxStamina_Modifier (float m)
		{
			max_stamina.AddTo_Modifier (m);
		}
		
		public void AddTo_StaminaExpend_Base (float b)
		{
			stamina_expend.AddTo_Base (b);
		}
		
		public void AddTo_StaminaExpend_Modifier (float m)
		{
			stamina_expend.AddTo_Modifier (m);
		}
		
		#endregion
	}
}

