using UnityEngine;
using System.Collections;

public class cameron_AI_Behavior : MonoBehaviour
{
	public GameObject player;
	private Dinosaur dino;
	private float counter = 0.0f;

	void Start ()
	{
		dino = new Dinosaur ();
	}

	void FixedUpdate ()
	{
		if (dino.Is_Alive ()) {
			float delta = Time.deltaTime;

			float xdiff = player.transform.position.x - transform.position.x;
			float zdiff = player.transform.position.z - transform.position.z;
			float theta = Mathf.Atan2 (zdiff, xdiff);

			Vector3 pos = transform.position;
			float speed = dino.Movespeed () * delta;
			pos.x += Mathf.Cos (theta) * speed;
			pos.z += Mathf.Sin (theta) * speed;
			transform.position = pos;

			counter += delta;
			if (counter > 1.0f) {
				counter = 0.0f;
				dino.AddPointsTo_Agility (0.05f);
			}
			dino.Heal (delta);
		}
	}

	public Dinosaur GetDinosaur ()
	{
		return dino;
	}
}
