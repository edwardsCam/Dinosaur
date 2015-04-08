using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Allosaurus
{
	class AllosaurusAI : DinoAI
	{
		
		protected override IDecision getNextDecision ()
		{
			if (intelligence == null) {
				return defaultDecision ();
			} else if (intelligence is AllosaurusIdle) {
				return new AllosaurusApproach ();
			} else if (intelligence is AllosaurusApproach) {
				return defaultDecision ();
			} else {
				return defaultDecision ();
			}
		}

		protected override IDecision defaultDecision ()
		{
			return new AllosaurusIdle ();
		}
	}
}
