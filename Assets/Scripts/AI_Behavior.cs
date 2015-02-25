﻿using UnityEngine;
using System.Collections;

public class AI_Behavior : MonoBehaviour
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
		if (counter > 10.0f) {
			counter = 0.0f;
			dino.AddPointsAgility (0.25f);
		}
	}
}
