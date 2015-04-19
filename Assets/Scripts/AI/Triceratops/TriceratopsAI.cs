using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Triceratops
{
    public class TriceratopsAI: DinoAI
    {
        private Vector3 target;
        public void SetTarget(Vector3 target)
        {
            this.target = target;
        }
        protected override IDecision getNextDecision()
        {
            if (intelligence == null)
            {
                return defaultDecision();
            }
            else if (intelligence is TriceratopsIdle)
            {
                return new TriceratopsCharge();
            }
            else if (intelligence is TriceratopsCharge)
            {
                return new TriceratopsIdle();
            }
            else
            {
                return defaultDecision();
            }
        }

        protected override IDecision defaultDecision()
        {
            return new TriceratopsIdle();
        }
    }
}
