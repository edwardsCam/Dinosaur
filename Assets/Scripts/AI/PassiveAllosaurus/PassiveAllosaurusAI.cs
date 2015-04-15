using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.PassiveAllosaurus
{
	class PassiveAllosaurusAI : DinoAI
	{
		
		protected override IDecision getNextDecision ()
		{
			return defaultDecision ();
		}

		protected override IDecision defaultDecision ()
		{
			return new PassiveAllosaurusIdle ();
		}
	}
}
