using UnityEngine;
using System.Collections;

public class AI_Behavior : MonoBehaviour
{
	public GameObject player;
	public Dinosaur dino;
	private float counter = 0.0f;

	void Start ()
	{
		dino = new Dinosaur ();
	}

	void FixedUpdate ()
	{

		float delta = Time.deltaTime;

		float xdiff = player.transform.position.x - transform.position.x;
		float zdiff = player.transform.position.z - transform.position.z;
		float theta = Mathf.Atan2 (zdiff, xdiff);

		float speed = dino.agility.Movespeed ();
		Vector3 pos = transform.position;
		pos.x += Mathf.Cos (theta) * speed * delta;
		pos.z += Mathf.Sin (theta) * speed * delta;

		transform.position = pos;

		counter += delta;

		if (counter > 5.0f) {
			counter = 0.0f;
			dino.agility.AddMovespeedModifier (0.1f);
		}
	}
}
