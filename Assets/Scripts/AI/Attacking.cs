using UnityEngine;
using System.Collections;

public class Attacking : MonoBehaviour
{
	private Dinosaur me;
	private bool attack_is_cooling_down;
	private float attack_timer;
	public float attack_cooldown = 1.0f;
	
	void Start ()
	{
		me = gameObject.GetComponent<DinosaurObjectGetter> ().dinosaur ();
		attack_is_cooling_down = false;
		attack_timer = 0;
	}

	void Update ()
	{
		if (me.Is_Alive ()) {
			if (attack_is_cooling_down) {
				attack_timer += Time.deltaTime;
				if (attack_timer > attack_cooldown) {
					attack_timer = 0f;
					attack_is_cooling_down = false;
				}
			} else {
				int layer = 1 << 8; //Dinosaur is layer 8
				Collider[] colliders = Physics.OverlapSphere (gameObject.transform.position, me.Attack_Radius (), layer);
				foreach (Collider c in colliders) {
					var getter = gameObject.GetComponent<DinosaurObjectGetter> ();
					if (getter != null) {
						me.Attack (getter.dinosaur ());
						attack_is_cooling_down = true;
						break;
					}
				}
			}
		}
	}
}
